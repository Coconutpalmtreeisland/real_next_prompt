'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Form from '@components/Form';

const CreatePrompt = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const [submitting, setSubmitting] = useState(false);
    const [post, setPost] = useState({
        prompt: '',
        tag: '',
    });

    const createPrompt = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch('/api/prompt/new', {
                method: 'POST', // HTTP 요청 메서드를 POST로 지정
                body: JSON.stringify({  // JSON 형태로 데이터를 전송
                    prompt: post.prompt,
                    userId: session?.user.id,
                    tag: post.tag,
                }),
            });

            if (response.ok) {
                router.push('/');
            }
        } catch (err) {
            console.log(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form
            type='Create'
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={createPrompt}
        />
    );
};

export default CreatePrompt;