"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { CollaborationPostSchema, type CollaborationPostValues } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { createCollaborationPost } from "@/app/actions/collaborate";

export function NewCollaborationPostDialog() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<CollaborationPostValues>({
    resolver: zodResolver(CollaborationPostSchema),
    defaultValues: {
      title: "",
      category: undefined,
      description: "",
    }
  });

  const onSubmit = async (values: CollaborationPostValues) => {
    const result = await createCollaborationPost(values);
    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      });
      form.reset();
      setIsOpen(false);
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Collaboration Post</DialogTitle>
          <DialogDescription>
            Share your idea or request with the campus community.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
             <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <FormControl>
                            <Input id="title" placeholder="e.g. Study group for CS101" className="col-span-3" {...field} />
                        </FormControl>
                         <FormMessage className="col-span-4 pl-[105px]" />
                    </FormItem>
                )}
                />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Category</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="study-group">Study Group</SelectItem>
                            <SelectItem value="project">Project</SelectItem>
                            <SelectItem value="club">Club</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage className="col-span-4 pl-[105px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <FormControl>
                        <Textarea id="description" placeholder="Describe your collaboration request in detail." className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 pl-[105px]" />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Posting..." : "Post"}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
