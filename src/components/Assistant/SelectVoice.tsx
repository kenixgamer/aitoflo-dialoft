import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { VOICES } from "@/constants/voices";
import { PlayIconMd, PauseIconMd } from "@/utils/icons/icons";

interface SelectVoiceProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (voiceId: string) => void;
  selectedVoiceId?: string;
}

const SelectVoice = ({ isOpen, onClose, onSelect, selectedVoiceId }: SelectVoiceProps) => {
  const [selectedVoice, setSelectedVoice] = useState<string>(selectedVoiceId || "");
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedAccent, setSelectedAccent] = useState<string>("all");
  const [selectedTone, setSelectedTone] = useState<string>("all");
  const { toast } = useToast();

  // Get unique values for filters
  const accents = ["all", ...new Set(VOICES.map(voice => voice.accent))];
  const tones = ["all", ...new Set(VOICES.map(voice => voice.tone))];
  const genders = ["all", ...new Set(VOICES.map(voice => voice.gender))];

  const filteredVoices = VOICES.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = selectedGender === "all" || voice.gender === selectedGender;
    const matchesAccent = selectedAccent === "all" || voice.accent === selectedAccent;
    const matchesTone = selectedTone === "all" || voice.tone === selectedTone;
    return matchesSearch && matchesGender && matchesAccent && matchesTone;
  });

  const handlePlayPause = async (voiceId: string) => {
    const voice = VOICES.find(v => v.id === voiceId);
    if (!voice) return;

    if (isPlaying === voiceId) {
      const audio = document.getElementById(`audio-${voice.name}`) as HTMLAudioElement;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setIsPlaying(null);
    } else {
      try {
        if (isPlaying) {
          const prevVoice = VOICES.find(v => v.id === isPlaying);
          if (prevVoice) {
            const prevAudio = document.getElementById(`audio-${prevVoice.name}`) as HTMLAudioElement;
            if (prevAudio) {
              prevAudio.pause();
              prevAudio.currentTime = 0;
            }
          }
        }
        
        const audio = document.getElementById(`audio-${voice.name}`) as HTMLAudioElement;
        if (audio) {
          audio.src = `/voice/${voice.name}.mp3`;
          await audio.play();
          setIsPlaying(voiceId);
          
          audio.onended = () => {
            setIsPlaying(null);
          };
        }
      } catch (error) {
        console.error("Error playing audio:", error);
        toast({
          title: "Error",
          description: "Failed to play voice sample",
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    setSelectedVoice(selectedVoiceId || "");
  }, [selectedVoiceId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-black border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Select Voice</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search voices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700"
              />
            </div>
            <Select 
              value={selectedGender}
              onValueChange={setSelectedGender}
            >
              <SelectTrigger className="w-[150px] bg-zinc-900 text-white border-zinc-800 focus:border-zinc-700">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent className="bg-black border-zinc-800">
                {genders.map(gender => (
                  <SelectItem key={gender} value={gender} className="text-white hover:bg-zinc-800">
                    {gender === "all" ? "All Genders" : gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={selectedAccent}
              onValueChange={setSelectedAccent}
            >
              <SelectTrigger className="w-[150px] bg-zinc-900 text-white border-gray-800">
                <SelectValue placeholder="Accent" />
              </SelectTrigger>
              <SelectContent className="bg-black border-zinc-800">
                {accents.map(accent => (
                  <SelectItem key={accent} value={accent} className="text-white hover:bg-zinc-800">
                    {accent === "all" ? "All Accents" : accent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={selectedTone}
              onValueChange={setSelectedTone}
            >
              <SelectTrigger className="w-[150px] bg-zinc-900 text-white border-gray-800">
                <SelectValue placeholder="Tone" />
              </SelectTrigger>
              <SelectContent className="bg-black border-zinc-800">
                {tones.map(tone => (
                  <SelectItem key={tone} value={tone} className="text-white hover:bg-zinc-800">
                    {tone === "all" ? "All Tones" : tone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-2">
            {filteredVoices.map((voice) => (
              <div
                key={voice.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedVoice === voice.id 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-zinc-900 hover:bg-zinc-800'
                }`}
                onClick={() => setSelectedVoice(voice.id)}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-white">{voice.name}</span>
                      <span className="text-sm text-zinc-400 ml-2">{voice.accent}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPause(voice.id);
                      }}
                      className="text-white hover:bg-zinc-800"
                    >
                      {isPlaying === voice.id ? <PauseIconMd /> : <PlayIconMd />}
                    </Button>
                  </div>
                  <div className="text-sm text-zinc-400">
                    {voice.tone} • {voice.gender}
                  </div>
                </div>
                <audio 
                  id={`audio-${voice.name}`} 
                  src={`/voice/${voice.name}.mp3`}
                  preload="none"
                  onError={(e) => {
                    console.error('Audio error:', e);
                    toast({
                      title: "Error",
                      description: `Failed to load audio for ${voice.name}`,
                      variant: "destructive"
                    });
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="normal"
              onClick={onClose}
              className="hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (selectedVoice) {
                  onSelect(selectedVoice);
                  onClose();
                }
              }}
              disabled={!selectedVoice}
              className="shadow-[0_0_10px_rgba(147,51,234,0.3)]"
            >
              Select Voice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectVoice;