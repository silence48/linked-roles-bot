export const getFields = (fields: any[]) => { 
  return fields.map((item: any) => {
    const isArr = Object.prototype.toString.call(item) == '[object Array]'
    if (isArr) {
      const output = item.map(({ field, title, description }: any) => {
        return {...field, title, description}
      })
      return output
    } else {
      const { field, title, description } = item;
      return [{...field, title, description}]
    }
  })
}