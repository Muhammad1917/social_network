import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ProfileAvatar({ src, username, size = "xl" }) {
    const sizeClasses = {
        sm: "h-20 w-20",
        md: "h-24 w-24",
        lg: "h-28 w-28",
        xl: "h-32 w-32",
    };

    const sizeClass = sizeClasses[size] || sizeClasses.xl;

    return (
        <Avatar size={size} className={`${sizeClass} rounded-full border-4 border-background shadow-lg`}>
            {src ? (
                <AvatarImage src={src} alt={username} />
            ) : (
                <AvatarFallback className="text-lg">
                    {username?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
            )}
        </Avatar>
    );
}