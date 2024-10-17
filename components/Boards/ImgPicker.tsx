import { useState, useEffect } from "react";
import unsplashApi from "@/lib/unsplash";
import Image from "next/image";
import Link from "next/link";
import { InputType } from "@/actions/createBoard/types";

import { Check } from "lucide-react";
import Spinner from "../Spinner";

import { defaultImages } from "@/lib/defaultImages";

interface ImgPickerProps {
  onChange: (value: InputType['image']) => void;
  value: InputType['image'];
  error?: string;
}

export interface UnsplashImage {
  id: string;
  urls: { thumb: string; full: string };
  alt_description: string | null;
  user: {
    name: string;
    username: string;
  };
  links: { html: string };
}

const ImgPicker: React.FC<ImgPickerProps> = ({ onChange, value, error }) => {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const result = await unsplashApi.photos.getRandom({
        collectionIds: ["317099"],
        count: 3,
      });
      if (Array.isArray(result.response)) {
        setImages(result.response);
      } else if (result.response) {
        setImages([result.response]);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      if (defaultImages.length > 0) {
        setImages(defaultImages);
      } else {
        setFetchError("Unable to load images. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);


  const handleImageSelect = (image: UnsplashImage) => {
    onChange({
      id: image.id,
      urls: {
        thumb: image.urls.thumb,
        full: image.urls.full,
      },
      author: image.user.name,
      links: {
        html: image.links.html,
      },
    });
  };


  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Spinner variant="dark" />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <div
            key={image.id}
            className={`
              relative aspect-video group hover:opacity-75 transition cursor-pointer
              ${
                value?.id === image.id
                  ? "ring-2 ring-blue-600"
                  : "ring-1 ring-neutral-200"
              }
              rounded-md overflow-hidden
            `}
            onClick={() => handleImageSelect(image)}
          >
            <Image
              src={image.urls.thumb}
              alt={image.alt_description || "Unsplash image"}
              className="object-cover"
              fill
            />
            {value?.id === image.id && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
      {fetchError && (
        <p className="text-red-500 text-sm">{fetchError}</p>
      )}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      {value.id && (
        <div className="text-xs text-neutral-500 text-center">
          Photo by{" "}
          <Link
            href={`https://unsplash.com/@${value.author}?utm_source=task-craft&utm_medium=referral`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-neutral-700"
          >
            {value.author}
          </Link>{" "}
          on{" "}
          <Link
            href="https://unsplash.com/?utm_source=task-craft&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-neutral-700"
          >
            Unsplash
          </Link>
        </div>
      )}
    </div>
  );
};

export default ImgPicker;
