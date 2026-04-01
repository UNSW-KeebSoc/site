import { getPostBySlug } from "@/lib/blog";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import styles from "../page.module.css";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ComponentProps } from "react";
import { ImageModal } from "@/components/Blog/ImageModal";

const CustomImage = (props: ComponentProps<"img">) => {
    return <ImageModal {...props} containerClassName={styles.imgContainer} />;
};

const CustomAudio = (props: ComponentProps<"audio">) => {
    const { src, ...rest } = props;
    if (!src) return null;
    return (
        <div>
            <audio controls {...rest}>
                <source src={src as string} />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};

const CustomLink = (props: ComponentProps<"a">) => {
    return (
        <a {...props} target="_blank" rel="noopener noreferrer">
            {props.children}
        </a>
    );
};

const components = {
    img: CustomImage,
    audio: CustomAudio,
    a: CustomLink,
};

const options: MDXRemoteProps["options"] = {
    mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [],
    },
};

export default async function Blog({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    // const post = getPostBySlug(slug);

    try {
        const post = getPostBySlug(slug);
        return (
            <article className={styles.prose}>
                <h1>{post.fm.title}</h1>
                <div className={styles.postMetaInline}>
                    <p className={styles.postAuthor}>{post.fm?.author}</p>
                    <p className={styles.postDate}>{post.fm?.date}</p>
                </div>
                <MDXRemote
                    source={post.content}
                    options={options}
                    components={components}
                />
            </article>
        );
    } catch {
        notFound();
    }
}
