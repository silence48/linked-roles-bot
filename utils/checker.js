async function getQuestPayments(pubkey) {
    // Set the "loadingActive" state to true, so we can display what we're doing
    // instead of just showing a blank set of badge cards.
    setLoadingActive(true)

    const server = new StellarSdk.Server('https://horizon.stellar.org')

    // Grabbing all operations for the given account, rather than just 200, in
    // case some of the earned badges have "fallen off"
    let accountOperations = [];
    let opRes = await server.operations().forAccount(pubkey).limit(200).order('desc').call();
    while (accountOperations.length % 200 === 0 || opRes.records.length !== 0) {
      accountOperations = accountOperations.concat(opRes.records)
      opRes = await opRes.next()
    }

    const badgePayments = accountOperations
      // Looking for non-native assets being paid to this account.
      .filter(item => item.type === 'payment' && item.asset_type !== 'native')
      // Looking for assets which are actually earned by the user and paid by
      // the issuer. This will keep the site from being used by those who have
      // purchased badges or traded for them.
      .filter(item => badgeDetails.find(({code, issuer}) => item.asset_code === code && item.from === issuer));

    const badgeOperations = accountOperations
      // Looking for create_claimable_balance operations with the pubkey as one
      // of the claimants listed.
      .filter(item => item.type === 'create_claimable_balance' && item.claimants.some(e => e.destination === pubkey))
      // Looking for create_claimable_balance operations that line up with our
      // known SQ asset codes and issuers.
      .filter(item => badgeDetails.find(({code, issuer}) => item.asset.split(':')[0] === code && item.asset.split(':')[1] === issuer))

    let allBadges = await Promise.all(
      badgeDetails
        .map(async (item) => {
          let payment
          // SSQ0[23] & SQ040\d badges are sent as a claimable balance. For
          // this, we'll have to query the issuing account to make sure it's
          // been received by legitimate means.
          if (/^SSQ0[234]|SQ040[1-6]$/.test(item.code)) {
            // Look for create_claimable_balance operations with the correct
            // asset code and the correct source_account.
            payment = badgeOperations.find(({asset, source_account}) => item.code === asset.split(':')[0] && item.issuer === source_account && item.issuer === asset.split(':')[1])
          } else {
            // Look for a payment of the specific asset codes.
            payment = badgePayments.find(({asset_code, from}) => item.code === asset_code && item.issuer === from)
          }
          // If none are found, return the item with the 'owned' key set false.
          if (!payment) return item;
          return {
            ...item,
            owned: true,
            date: new Date(payment.created_at).toISOString().split('T')[0],
            hash: payment.transaction_hash,
            link: `https://stellar.expert/explorer/public/tx/${payment.transaction_hash}`,
            operation: payment.id,
            prize: await getPrizeTransaction(payment.transaction_hash)
          };
        }));
      let userBadges = allBadges.filter(item => item.owned === true)

      // We're saving two arrays of badge details, to assist in badge filtering
      // when we are presenting them to the user. These arrays will be used to
      // construct a third array of all assets being displayed.
      // What's the more efficient way to accomplish this? I know it's out there
      setQuester({all_assets: allBadges, user_assets: userBadges, type: 'fill_assets'})

      // Set the "loadingActive" state to false, because now the badges have
      // been poopulated into the array.
      setLoadingActive(false)
  }

  /**
   * Get all the transaction operations for a given hash, and see if there was
   * any payment of XLM in the transaction. If so, we'll save that as the prize
   * for that particular SQ asset.
   */
  async function getPrizeTransaction(hash) {
    let res = await fetch("https://horizon.stellar.org/transactions/" + hash + "/operations")
    let json = await res.json()
    let prizeRecord = json._embedded.records
      .filter(item => item.hasOwnProperty('asset_type') && item.asset_type === 'native')
    return prizeRecord.length > 0 ? parseInt(prizeRecord[0].amount) : false
  }