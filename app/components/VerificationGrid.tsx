import React from 'react';
import { Card } from '~/components/Card'
import type { UserBadgeDetail } from "~/types";
import { useFetcher  } from "@remix-run/react";

/**
 * This component creates a Grid of "cards" that will each contain the
 * information gathered about one particular asset, in relation to the given
 * stellar account.
 */
//export default function Grid(props) {
export const VerificationGrid = (props: any) => {
    const badgeFetcher = useFetcher();
    React.useEffect(() => {
        if (badgeFetcher.state === "idle" && badgeFetcher.data == null) {
            console.log("FETCHING")
            badgeFetcher.load(`/verifyRoles`);
        }
    }, [badgeFetcher]);
    if (!badgeFetcher.data) {
        return <div>Loading...</div>; // Replace with your preferred loading state
      }
    const {userOwnedBadges} = badgeFetcher.data
    // Create an array of badges (<Card />s) given an array of badges.
    function createBadgesArr(userOwnedBadges: UserBadgeDetail[]) {
        let badgesArr = []
        let badgeGroup = []
        userOwnedBadges.forEach((badge: UserBadgeDetail, i: number, arr: any[]) => {
            // Let's get our bearing of where we are in the array
            let series = badge.code.slice(0, -2)
            let lastBadge = i >= 1 ? arr[i - 1] : null
            let lastSeries = lastBadge ? lastBadge.code.slice(0, -2) : null
            if (series !== lastSeries) {
                // If we're starting a new series, push the previous group to the array and start a new one
                if (badgeGroup.length > 0) {
                    badgesArr.push(
                        <div key={`group${i}`} className="flex justify-center mb-3">
                            <div className="flex flex-wrap justify-center">
                            {badgeGroup}
                            </div></div>
                    );
                    badgeGroup = [];
                }
                if (series === 'SSQ') {
                    if (lastSeries !== 'SSQ') {
                        // Put a series header for our Side Quests
                        badgesArr.push(<div key="sideQuestsRow" className="row-auto text-center mt-4"> <h2 key="sideQuests">Standalone Side Quest Badges</h2> </div>)
                        badgesArr.push(<div key="sideQuestsDescription" className="row-auto text-center"> <p key="sideDescription"> <em>Side Quests</em> are event-based, single-issue badges that prove you've participated in something special within the Stellar Ecosystem.</p> </div>)
                    }
                } else if (series === 'SQ05') {
                    badgesArr.push(
                        <div key="sorobanQuestsRow" className="row-auto break-before-auto break-after-auto text-center mt-4"> <h2 key="sorobanQuests">Soroban Quest</h2> </div>)
                    badgesArr.push(
                        <div key="sorobanQuestsDescription" className="row-auto text-center"> <p key="sorobanDescription"> <em>Soroban Quest</em> is the bleeding-edge educational experience to prepare developers to use Stellar's upcoming smart contract platform: Soroban! You know, like the abacus. <a target="_blank" rel="noreferrer" href="https://soroban.stellar.org">Learn more here!</a> </p> </div>)
                    badgesArr.push(
                        <div key={`header${i}Row`} className="row-auto mt-3 text-center"> <h3 key={`header${i}`}>Series {badge.code.substr(2, 2)} Badges</h3> </div>)
                    badgesArr.push(
                        <div key="sorobanSeriesFiveDescription" className="row-auto text-center"> <p key="seriesFiveDescription">I know, I know... We're starting with <code>Series 05</code>?? Yeah, it's complicated... We're picking up the numbering from where the "legacy quests" ended, but focusing on Soroban.</p> </div>)
                } else if (series === 'SQL00') {
                    badgesArr.push(<div key="learnQuestsRow" className="row-auto mt-3 text-center"><h2 key="learnQuests">Stellar Quest Learn</h2></div>)
                    badgesArr.push(<div key="learnQuestsDescription" className="row-auto text-center"><p key="learnDescription"><em>Stellar Quest Learn</em> is the re-imagining of what gamified blockchain education can look like! These badges showcase the guided path through the fundamentals of the Stellar network.</p></div>)
                    badgesArr.push(<div key="learnPioneerRow" className="row-auto mt-3 text-center"><h3 key="learnPioneer">Pioneer Quest</h3></div>)
                    badgesArr.push(<div key="learnPioneerDescription" className="row-auto text-center"><p key="pioneerDescription">Before we head out into the great beyond, let's equip ourselves with some wallet fundamentals.</p></div>)
                } else if (series === 'SQL01') {
                    badgesArr.push(<div key="learnPaymentsRow" className="row-auto mt-3 text-center"><h3 key="learnPayments">Payment Operations</h3></div>)
                    badgesArr.push(<div key="learnPaymentsDescription" className="row-auto text-center"><p key="paymentsDescription">Experiment with accounts and payments in this fundamental series.</p></div>)
                } else if (series === 'SQL02') {
                    badgesArr.push(<div key="learnConfigurationRow" className="row-auto mt-3 text-center"><h3 key="learnConfiguration">Configuration Operations</h3></div>)
                    badgesArr.push(<div key="learnConfigurationDescription" className="row-auto text-center"><p key="configurationDescription">Time to dig a little deeper with some more complex account-level operations.</p></div>)
                } else if (series === 'SQL03') {
                    badgesArr.push(<div key="learnAdvancedRow" className="row-auto mt-3 text-center"><h3 key="learnAdvanced">Advanced Operations</h3></div>)
                    badgesArr.push(<div key="learnAdvancedDescription" className="row-auto text-center"><p key="advancedDescription">Gear up to learn some of the wildest operations on the Stellar network.</p></div>)
                } else if (series === 'SSQL') {
                    badgesArr.push(<div key="learnSideQuestsRow" className="row-auto mt-3 text-center"><h3 key="learnSideQuests">SQ Learn Side Quests</h3></div>)
                    badgesArr.push(<div key="learnSideQuestsDescription" className="row-auto text-center"><p key="sideQuestsDescription">These are more intense, single-topic, deeper dives into interesting, experimental, and/or less-discussed corners of the Stellar network.</p></div>)
                } else {
                    if ((lastSeries === null || /^S?SQL/.test(lastSeries)) && /^SQ0[1..4]$/.test(series)) {
                        // Put a new header to specify that we're shifting to the legacy badges
                        badgesArr.push(<div key="legacyQuestsRow" className="row-auto mt-4 text-center"><h2 key="legacyQuests">Stellar Quest Legacy</h2></div>)
                        badgesArr.push(<div key="legacyQuestsDescription" className="row-auto text-center"><p key="legacyDescription"><em>Stellar Quest Legacy</em> is the old standard of what we have built our current efforts upon. Series-based, increasingly complex, sometimes-live challenges and puzzles.</p></div>)
                    }
                    // Put a header for the series that is different from the last
                    badgesArr.push(<div key={`header${i}Row`} className="row-auto mt-3 text-center text-center"><h3 key={`header${i}`}>Series {badge.code.substr(2, 2)} Badges</h3></div>)
                }
            }
            badgeGroup.push(<Card key={`${badge.code}-${badge.issuer}-${i}`} badge={badge} description={props.descriptions} />);
        })
        // Push the last group to the array
        if (badgeGroup.length > 0) {
            badgesArr.push(

                <div key="grouplastd2" className="flex justify-center mb-3">
                    <div className="flex flex-wrap justify-center">
                        {badgeGroup}
                    </div></div>
            );
        }
        return badgesArr
    };

    return (
        <div key="badgesGrid" className="justify-center  justify-items-center mb-8">
            {createBadgesArr(userOwnedBadges)}
        </div>
    )
}
