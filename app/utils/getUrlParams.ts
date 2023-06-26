const getUrlParams = (url: URL): { [key: string]: string } => {
    return Array.from(url.searchParams.entries()).reduce(
      (obj: { [key: string]: string }, [key, value]: [string, string]) => {
        obj[key] = value;
        return obj;
      },
      {}
    );
  };
  
  export { getUrlParams };