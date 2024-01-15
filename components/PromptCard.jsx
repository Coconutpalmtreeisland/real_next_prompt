'use client';

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const PromptCard = ({ post, handleTagClick, handleEdit, handleDelete }) => {
  const { data: session } = useSession();
  const pathName = usePathname(); // URL의 경로 부분 '/profile' 경로에 있을 경우에만 'Edit'과 'Delete' 옵션이 표시되도록 하기 위해 설정
  const router = useRouter();

  const [copied, setCopied] = useState("");

  const handleProfileClick = () => {
    console.log(post);

    // 포스트 작성자랑 세션에 user.id랑 같으면 내 프로필 페이지로 이동
    if (post.creator._id === session?.user.id) return router.push("/profile");

    // 그렇지 않으면 해당 포스트 작성자 프로필 페이지로 이동
    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };

  const handleCopy = () => {
    setCopied(post.prompt); // 복사 성공 이미지 표시를 위해 setCopied에 저장
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(""), 3000);  // 다시 복사 가능 이미지를 표시하기 위해 setCopied 값 초기화
  };

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div className="flex-1 flex justify-start items-center gap-3 cursor-pointer" onClick={handleProfileClick}>
          <Image
            src={post.creator.image}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />

          <div className="flex flex-col">
            <h3 className="font-fugaz font-semibold text-gray-900">
              {post.creator.username}
            </h3>
            <p className="font-inter text-sm text-gray-500">
              {post.creator.email}
            </p>
          </div>
        </div>

        <div className="copy_btn" onClick={handleCopy}>
          <Image
            src={copied === post.prompt ? '/assets/icons/tick.svg' : '/assets/icons/copy.svg'}  // copid에 저장된 값이 post.prompt 같으면 체크 표시, 비어있으면 복사 가능 표시
            alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
            width={12}
            height={12}
          />
        </div>
      </div>

      <p className="my-4 font-fugaz text-sm text-gray-700">{post.prompt}</p>
      <p
        className="font-inter text-sm blue_gradient cursor-pointer"
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        #{post.tag}
      </p>

      {session?.user.id === post.creator._id && pathName === '/profile' && (
        <div className="mt-5 flex-center gap-4 border-t boder-gray-100 pt-3">
          <p
            className="font-inner text-sm green_gradient cursor-pointer"
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className="font-inner text-sm orange_gradient cursor-pointer"
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;