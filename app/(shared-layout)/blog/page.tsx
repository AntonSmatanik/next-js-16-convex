import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

// export const dynamic = "force-static";
// export const revalidate = 30;

export const metadata: Metadata = {
  title: "Blog | Next.js 16 & Convex Starter",
  description:
    "Explore our latest insights, trends, and stories on Next.js 16 and Convex in our blog.",
  category: "Web development",
  authors: [{ name: "Anton Smatanik" }],
};

export default function BlogPage() {
  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Explore our latest insights, trends, and stories on Next.js 16 and
          Convex in our blog.
        </p>
      </div>

      <Suspense fallback={<SkeletonLoadingUI />}>
        <LoadBlogList />
      </Suspense>
    </div>
  );
}

async function LoadBlogList() {
  // "use cache";
  // cacheLife("hours");
  // cacheTag("blog-list");
  await connection();
  const data = await fetchQuery(api.posts.getPosts);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((blog) => (
        <Card key={blog._id} className="pt-0">
          <div className="relative h-64 w-full overflow-hidden">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              className="rounded-t-lg"
            />
          </div>

          <CardContent>
            <Link href={`/blog/${blog._id}`}>
              <h1 className="pb-2 text-2xl font-semibold hover:text-primary">
                {blog.title}
              </h1>
            </Link>
            <p className="line-clamp-3 text-muted-foreground">{blog.body}</p>
          </CardContent>

          <CardFooter>
            <Link
              href={`/blog/${blog._id}`}
              className={buttonVariants({ className: "w-full" })}
            >
              Read More
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function SkeletonLoadingUI() {
  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
