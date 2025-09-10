import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/glass-card';
import { Button } from '../components/ui/glass-button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { useDraftSaving } from '../hooks/useDraftSaving';
import { TagSelector } from '../components/TagSelector';
import { MultiSelect } from '../components/MultiSelect';
import { ImageUploader } from '../components/ImageUploader';
import { User, Heart, MessageCircle, Camera, Save } from 'lucide-react';
import heroBackground from '../assets/hero-background.jpg';

interface FormData {
  wechat_id: string;
  gender: string;
  introduction: string;
  familiar_tags: string[];
  aspirational_tags: string[];
  self_traits: string[];
  ideal_traits: string[];
  physical_boundary: number;
  recent_topics: string;
  profile_photo: string;
}

const initialFormData: FormData = {
  wechat_id: '',
  gender: '',
  introduction: '',
  familiar_tags: [],
  aspirational_tags: [],
  self_traits: [],
  ideal_traits: [],
  physical_boundary: 3,
  recent_topics: '',
  profile_photo: '',
};

const ProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use custom hook for draft saving
  const { saveDraft, loadDraft, clearDraft } = useDraftSaving('profile-form');

  // Load draft on component mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setFormData(draft);
    }
  }, [loadDraft]);

  // Save draft whenever form data changes
  useEffect(() => {
    saveDraft(formData);
  }, [formData, saveDraft]);

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // TODO: Submit to your Rust backend
      console.log('Submitting form:', formData);
      
      // Clear draft after successful submission
      clearDraft();
      
      // Navigate to next step or show success message
      alert('Profile submitted successfully!');
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const personalityTraits = [
    'Adventurous', 'Artistic', 'Ambitious', 'Calm', 'Creative', 'Curious',
    'Energetic', 'Friendly', 'Funny', 'Honest', 'Intellectual', 'Kind',
    'Loyal', 'Optimistic', 'Outgoing', 'Patient', 'Reliable', 'Romantic'
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackground}
          alt="Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/90 to-background/95" />
      </div>

      <div className="relative z-10 p-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Complete Your Profile
            </h1>
            <p className="text-muted-foreground">
              Tell us about yourself to find your perfect match
            </p>
          </div>

          <GlassCard className="p-8 space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wechat_id">WeChat ID</Label>
                  <Input
                    id="wechat_id"
                    value={formData.wechat_id}
                    onChange={(e) => updateField('wechat_id', e.target.value)}
                    placeholder="Your WeChat ID"
                    className="bg-muted/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                    placeholder="Your gender"
                    className="bg-muted/50 border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="introduction">Self Introduction</Label>
                <Textarea
                  id="introduction"
                  value={formData.introduction}
                  onChange={(e) => updateField('introduction', e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="min-h-[120px] bg-muted/50 border-border/50"
                />
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Interests</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Things you're familiar with</Label>
                  <TagSelector
                    selectedTags={formData.familiar_tags}
                    onTagsChange={(tags) => updateField('familiar_tags', tags)}
                    placeholder="Select familiar interests..."
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Things you want to learn</Label>
                  <TagSelector
                    selectedTags={formData.aspirational_tags}
                    onTagsChange={(tags) => updateField('aspirational_tags', tags)}
                    placeholder="Select aspirational interests..."
                  />
                </div>
              </div>
            </div>

            {/* Personality */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Personality</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block">Your traits</Label>
                  <MultiSelect
                    options={personalityTraits}
                    selected={formData.self_traits}
                    onSelectionChange={(traits) => updateField('self_traits', traits)}
                    placeholder="Select your traits..."
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Ideal partner traits</Label>
                  <MultiSelect
                    options={personalityTraits}
                    selected={formData.ideal_traits}
                    onSelectionChange={(traits) => updateField('ideal_traits', traits)}
                    placeholder="Select ideal traits..."
                  />
                </div>
              </div>
            </div>

            {/* Physical Boundary */}
            <div className="space-y-4">
              <Label>Physical Boundary (1-5 scale)</Label>
              <div className="px-3">
                <Slider
                  value={[formData.physical_boundary]}
                  onValueChange={(value) => updateField('physical_boundary', value[0])}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>Conservative</span>
                  <span className="font-medium text-primary">
                    {formData.physical_boundary}
                  </span>
                  <span>Open</span>
                </div>
              </div>
            </div>

            {/* Recent Topics */}
            <div className="space-y-2">
              <Label htmlFor="recent_topics">Recent Conversation Topics</Label>
              <Textarea
                id="recent_topics"
                value={formData.recent_topics}
                onChange={(e) => updateField('recent_topics', e.target.value)}
                placeholder="What have you been talking about lately?"
                className="min-h-[100px] bg-muted/50 border-border/50"
              />
            </div>

            {/* Profile Photo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                <Label>Profile Photo (Optional)</Label>
              </div>
              <ImageUploader
                onImageUpload={(filename) => updateField('profile_photo', filename)}
                currentImage={formData.profile_photo}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                variant="gradient"
                size="lg"
                className="w-full"
              >
                {isLoading && <Save className="h-4 w-4 animate-spin" />}
                Submit Profile
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;