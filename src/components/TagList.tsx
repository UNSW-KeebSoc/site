import shared from "@/styles/shared.module.css";

interface TagListProps {
    tags?: string[];
}

// Read-only tag chips (the events filter has its own interactive buttons)
export default function TagList({ tags }: TagListProps) {
    if (!tags || tags.length === 0) return null;
    return (
        <div className={shared.tagList}>
            {tags.map((tag) => (
                <span key={tag} className={shared.tag}>
                    {tag}
                </span>
            ))}
        </div>
    );
}
