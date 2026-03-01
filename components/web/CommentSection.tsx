"use client";

import { commentSchema } from "@/app/schemas/comment";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { MessageSquare } from "lucide-react";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

export type Comment = z.infer<typeof commentSchema>;

export function CommentSection(props: {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>;
}) {
  const params = useParams<{ postId: Id<"posts"> }>();
  const [isPending, startTransition] = useTransition();

  const mutation = useMutation(api.comments.createComment);
  // const comments = useQuery(api.comments.getCommentsByPostId, {
  //   postId: params.postId,
  // });

  const comments = usePreloadedQuery(props.preloadedComments);

  const form = useForm<Comment>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
      postId: params.postId,
    },
  });

  const onSubmit = (data: Comment) => {
    startTransition(async () => {
      try {
        await mutation(data);
        form.reset();
        toast.success("Comment posted successfully!");
      } catch {
        toast.error("Failed to post comment.");
      }
    });
  };

  if (!comments) {
    return <p>Loading comments...</p>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">{comments.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            control={form.control}
            name="body"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Content</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Share your thoughts..."
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" disabled={isPending} className="mt-4">
            {isPending ? "Posting..." : "Post Comment"}
          </Button>
        </form>

        {comments?.length > 0 && <Separator className="my-6" />}

        <section className="mt-8 space-y-6">
          {comments?.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                  alt={comment.authorName}
                />
                <AvatarFallback>
                  {comment.authorName.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{comment.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment._creationTime).toLocaleString("sk-SK", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <div className="text-sm text-foreground/90 whitespace-pre-wrap">
                  {comment.body}
                </div>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
