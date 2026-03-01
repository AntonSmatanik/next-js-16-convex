import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Search } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { Input } from "../ui/input";

export function SearchInput() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  const results = useQuery(
    api.posts.searchPosts,
    term.length >= 2 ? { term, limit: 5 } : "skip",
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    setOpen(e.target.value.length > 0);
  };

  return (
    <div className="relative w-full max-w-sm z-10">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          value={term}
          onChange={handleChange}
          placeholder="Search posts..."
          className="w-full pl-8 bg-background"
        />
      </div>

      {open && term.length >= 2 && (
        <div className="absolute top-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          {results ? (
            results.length > 0 ? (
              results.map((result) => (
                <Link
                  onClick={() => {
                    setOpen(false);
                    setTerm("");
                  }}
                  href={`/blog/${result._id}`}
                  key={result._id}
                  className="flex flex-col px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <p className="font-medium truncate">{result.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {result.body.substring(0, 50)}
                  </p>
                </Link>
              ))
            ) : (
              <div className="p-4 text-sm text-muted-foreground text-center">
                No results found.
              </div>
            )
          ) : (
            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
              Searching...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
