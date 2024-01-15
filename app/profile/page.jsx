'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from '@components/Profile';

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [posts, setPosts] = useState([]);

  // 로그인 상태의 변화를 감지하고, 해당 사용자의 데이터를 서버로부터 불러와서 렌더링
  useEffect(() => {
    const fetchPosts = async () => {  // 사용자가 로그인한 상태일 때만 데이터를 불러오기
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();

      setPosts(data);
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure you want to delete this prompt?");

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, { // ObjectId 타입에서 문자열로 변환하기 위해 toString 메서드 호출
          method: 'DELETE'
        });

        // 삭제하는 포스트 아이디와 포스트 아이디가 다른 경우(삭제하는 포스트를 제외한 모든 포스트)를 새 배열에 저장
        const filteredPosts = posts.filter((p) => p._id !== post._id);

        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;