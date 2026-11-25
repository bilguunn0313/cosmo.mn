export function adapterConnectionString(databaseUrl: string): string {
  const url = new URL(databaseUrl);

  if (!url.searchParams.has('allowPublicKeyRetrieval')) {
    url.searchParams.set('allowPublicKeyRetrieval', 'true');
  }

  return url.toString();
}
