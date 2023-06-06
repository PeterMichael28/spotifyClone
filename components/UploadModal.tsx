"use client";

import uniqid from "uniqid";
import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import useUploadModal from '@/hooks/useUploadModal';
import { useUser } from "@/hooks/useUser";

import Modal from './Modal';
import Input from './Input';
import Button from './Button';

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadModal = useUploadModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    }
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      
        const { image, song, title, author } = values;
        const imageFile = image?.[0];
        const songFile = song?.[0]; 

        // if there is no user or image or song
      if (!imageFile || !songFile || !user) {
        toast.error('Missing fields')
        return;
      }

      const uniqueID = uniqid();

      //saving the song and the image to supabase storage
      const [songResult, imageResult] = await Promise.all([
        supabaseClient.storage
          .from('songs')
          .upload(`song-${title}-${uniqueID}`, songFile, {
            cacheControl: '3600',
            upsert: false
          } ),
          
        supabaseClient.storage
          .from('images')
          .upload(`image-${title}-${uniqueID}`, imageFile, {
            cacheControl: '3600',
            upsert: false
          })
      ]);
      
      const { data: songData, error: songError } = songResult;
        const { data: imageData, error: imageError } = imageResult;
        
        //if error uploading song
        if (songError) {
            setIsLoading(false);
            toast.error('Failed song upload');
            return;
          }
          
          //if error uploading image
          if (imageError) {
            setIsLoading(false);
            toast.error('Failed image upload');
            return;
          }

      
      // Create record 
        const { error: supabaseError } = await supabaseClient
        .from('songs')
        .insert({
            user_id: user.id,
            title,
            author,
            image_path: imageData.path,
            song_path: songData.path
        });

        //if there  an error
        if (supabaseError) {
        setIsLoading(false);
        toast.error(supabaseError.message);
        return;
        }
        
        //refresh the page
      router.refresh();
      setIsLoading(false);
      toast.success('Song created!');
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col gap-y-4"
      >
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder="Song author"
        />
        <div>
          <div className="pb-1">
            Select a song file
          </div>
          <Input
            placeholder="test" 
            disabled={isLoading}
            type="file"
            accept=".mp3"
            id="song"
            {...register('song', { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">
            Select an image
          </div>
          <Input
            placeholder="test" 
            disabled={isLoading}
            type="file"
            accept="image/*"
            id="image"
            {...register('image', { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit" className="py-3">
          Create
        </Button>
      </form>
    </Modal>
  );
}

export default UploadModal;