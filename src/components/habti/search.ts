export type HabtiSearch = {
  statut?: string | undefined;
  nouveau?: string | undefined;
  id?: string | undefined;
  jour?: string | undefined;
  type?: string | undefined;
  q?: string | undefined;
};

export const validateHabtiSearch = (search: Record<string, unknown>): HabtiSearch => {
  const str = (v: unknown) => (typeof v === "string" && v.length ? v : undefined);
  return {
    statut: str(search["statut"]),
    nouveau: str(search["nouveau"]),
    id: str(search["id"]),
    jour: str(search["jour"]),
    type: str(search["type"]),
    q: str(search["q"]),
  };
};
