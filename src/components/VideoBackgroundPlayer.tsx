export function VideoBackgroundPlayer({
  video_path,
  className,
  is_muted,
}: {
  video_path: string;
  className?: string;
  is_muted: boolean;
}) {
  return (
    <div className={`${className} absolute top-0 left-0 w-full h-full -z-10`}>
      <video
        className="w-full h-full object-cover"
        src={video_path}
        autoPlay
        muted={is_muted}
        loop
      />
    </div>
  );
}
