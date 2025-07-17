import { useAmbientSounds } from "@/hooks/useAmbientSounds";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from "lucide-react";

const soundOptions = [
  { value: "ocean", icon: "🌊", label: "Ocean", color: "bg-blue-50 hover:bg-blue-100 text-blue-700" },
  { value: "rain", icon: "🌧️", label: "Rain", color: "bg-gray-50 hover:bg-gray-100 text-gray-700" },
  { value: "birds", icon: "🕊️", label: "Birds", color: "bg-green-50 hover:bg-green-100 text-green-700" },
  { value: "library", icon: "📚", label: "Library", color: "bg-purple-50 hover:bg-purple-100 text-purple-700" },
  { value: "white-noise", icon: "🎵", label: "White Noise", color: "bg-pink-50 hover:bg-pink-100 text-pink-700" },
] as const;

export const AmbientSounds = () => {
  const {
    currentSound,
    isPlaying,
    volume,
    toggleSound,
    stopSound,
    setVolume,
  } = useAmbientSounds();

  return (
    <Card className="rounded-3xl shadow-lg border-pink-100">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-charcoal">
          <Volume2 className="w-5 h-5 mr-2 text-coral" />
          Ambient Sounds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {soundOptions.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              onClick={() => toggleSound(option.value)}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                option.color
              } ${
                currentSound === option.value && isPlaying
                  ? "ring-2 ring-offset-2 ring-coral"
                  : ""
              }`}
            >
              <span className="mr-2">{option.icon}</span>
              {option.label}
            </Button>
          ))}
        </div>

        {/* Volume Control */}
        {isPlaying && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Volume</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={stopSound}
                className="text-gray-500 hover:text-gray-700"
              >
                <VolumeX className="w-4 h-4" />
              </Button>
            </div>
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>
        )}

        {/* Current Playing */}
        {isPlaying && currentSound && (
          <div className="text-center text-sm text-gray-600">
            <p>
              Now playing: {soundOptions.find(s => s.value === currentSound)?.label}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
