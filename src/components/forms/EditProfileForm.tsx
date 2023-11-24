import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProfileValidation } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import Loader from "../shared/Loader";
import ProfileUploader from "../shared/ProfileUploader";

const EditProfileForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate()
  const { id } useParams();
  const { user, setUser } = useUserContext();
  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    },
  });

  const { data: currentUser } = useGetUserById(id || "");
  const { mutateAsync: updateUser, isLoading: isLoadingUpdate } = useUpdateUser()

  if (!currentUser)
  return (
    <div className="flex-center w-full h-full">
        <Loader />
    </div>
    )

  // 2. Define a submit handler.
  const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
    const updatedUser = await updateUser({
        userId: currentUser.$id,
        name: value.name,
        bio: value.bio,
        file: value.file,
        imageUrl: currentUser.imageUrl,
        imageId: currentUser.imageId,
    });

    if (!updatedUser) {
        toast({
            title: "Update user failed. Please try again.",
        });
    }

    setUser({
        ...user,
        name: updatedUser?.name,
        bio: updateUser?.bio,
        imageUrl: updatedUser?.imageUrl,
    });
    return navigate(`/profile/${id}`);
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
        onSubmit={form.handleSubmit(handleUpdate)}
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem className="flex">
              <FormControl><ProfileUploader fieldChange={field.onChange} mediaUrl={currentUser.imageUrl} /></FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Name</FormLabel>
              <FormControl>
                <Input className="shad-input" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Username</FormLabel>
              <FormControl>
                <Input className="shad-input" type="text" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">email</FormLabel>
              <FormControl>
                <Input className="shad-input" type="text" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Bio</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button className="shad-button_dark_4" type="button">
            Cancel
          </Button>
          <Button
            className="shad-button_primary whitespace-nowrap"
            type="submit"
          >
            Update Profile
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProfileForm;
