import type { Dua } from "@/content/types";
import { DalilList } from "./dalil";
import { Badge, Card, CardContent, CardFooter, CardHeader } from "./noor-ui";

export const DuaCard = ({ dua }: { dua: Dua }) => (
  <Card className="overflow-hidden border-border bg-card shadow-sm">
    {(dua.title || dua.repeat) && (
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0 border-b border-border bg-muted/50 px-4 py-3">
        {dua.title && (
          <h3 className="text-sm font-semibold text-card-foreground">
            {dua.title}
          </h3>
        )}
        {dua.repeat && (
          <Badge
            variant="outline"
            className="rounded-full border-primary/30 bg-primary/10 text-xs font-semibold text-primary"
          >
            {dua.repeat}
          </Badge>
        )}
      </CardHeader>
    )}
    <CardContent className="space-y-3 p-5">
      <p dir="rtl" lang="ar" className="text-arabic text-right text-card-foreground">
        {dua.arabic}
      </p>
      <p className="latin-text text-reading font-medium italic text-primary">
        {dua.latin}
      </p>
      <p className="translation-text text-reading text-muted-foreground">
        “{dua.translation}”
      </p>
    </CardContent>
    <CardFooter className="dalil-section block border-t border-border bg-muted/25 px-4 py-3">
      <DalilList items={dua.dalil} />
    </CardFooter>
  </Card>
);
