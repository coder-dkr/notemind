'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDropzone } from 'react-dropzone';
import { Cloud, Upload } from 'lucide-react';

interface AvatarSelectionProps {
  value: string;
  onChange: (value: string) => void;
}

const DEFAULT_AVATARS = [
  {
    id: 'goat',
    name: 'Goat',
    url: 'https://occ-0-395-64.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABaZDG-e5z0ZBO2ICTZ7swQGZWXV3GtvPhwvMzxnCgRI1rkyWFRZEriQYXBdMZ65AJySu0YtoCK-dozyf7JObBV4vgpqwwvGPhA.png?r=b6d',
  },
  {
    id: 'lucifer',
    name: 'Lucifer',
    url: 'https://occ-0-395-64.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABTrM4t1rTAjmQwNtOPMY4ll7JBLZE4nkjsoxUP1sCoPs1gMdv9VoxVhbAoh0PRUlLja1hWoA5zq7Hejjbf1C4SBPPHOQchLmvvyv.png?r=d9d',
  },
  {
    id: 'rooster',
    name: 'Rooster',
    url: 'https://occ-0-395-64.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABVOUc4gXCizdZZ_pTe97G7nf7FRR94-d6ktp2BEFIPk_EQIOrttuxm6Znt02MwQ--i5C_IR0nDoK0iCByTgb3g71TmbTDjgxBQ.png?r=9fc',
  },
];

export function AvatarSelection({ value, onChange }: AvatarSelectionProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(value);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  const onDrop = (acceptedFiles: File[]) => {
    // In a real app, you would upload the file to storage
    // For this example, we'll just use a fake URL
    if (acceptedFiles.length > 0) {
      const fakeUrl = URL.createObjectURL(acceptedFiles[0]);
      setCustomAvatarUrl(fakeUrl);
      onChange(fakeUrl);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 1,
  });

  const handleSelectDefaultAvatar = (avatar: typeof DEFAULT_AVATARS[0]) => {
    setSelectedAvatar(avatar.url);
    onChange(avatar.url);
  };

  const handleCustomUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAvatarUrl(e.target.value);
  };

  const handleCustomUrlSubmit = () => {
    if (customAvatarUrl) {
      onChange(customAvatarUrl);
    }
  };

  return (
    <Tabs defaultValue="default" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="default">Default Avatars</TabsTrigger>
        <TabsTrigger value="custom">Upload Your Own</TabsTrigger>
      </TabsList>
      <TabsContent value="default" className="mt-4">
        <div className="grid grid-cols-3 gap-4">
          {DEFAULT_AVATARS.map((avatar) => (
            <div
              key={avatar.id}
              className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedAvatar === avatar.url
                  ? 'bg-primary/10 ring-2 ring-primary'
                  : 'hover:bg-muted'
              }`}
              onClick={() => handleSelectDefaultAvatar(avatar)}
            >
              <Avatar className="h-16 w-16 mb-2">
                <AvatarImage src={avatar.url} alt={avatar.name} />
                <AvatarFallback>
                  {avatar.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{avatar.name}</span>
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="custom" className="mt-4 space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Cloud className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center mb-1">
            Drag and drop your avatar here, or click to select a file
          </p>
          <p className="text-xs text-muted-foreground/70 text-center">
            (Supports: JPG, PNG, GIF)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar-url">Or enter image URL</Label>
          <div className="flex gap-2">
            <Input
              id="avatar-url"
              placeholder="https://example.com/avatar.jpg"
              value={customAvatarUrl}
              onChange={handleCustomUrlChange}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCustomUrlSubmit}
              disabled={!customAvatarUrl}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {(customAvatarUrl || selectedAvatar) && (
          <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
            <p className="text-sm mb-2">Preview:</p>
            <Avatar className="h-20 w-20">
              <AvatarImage src={customAvatarUrl || selectedAvatar} alt="Preview" />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}