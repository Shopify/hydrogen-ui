export function errorIfServer(fnName: string): boolean {
  if (!window) {
    console.error(
      `${fnName} should only be used within the useEffect callback or event handlers`
    );
    return true;
  }
  return false;
}
