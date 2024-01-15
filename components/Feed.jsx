'use client';

import { useState, useEffect } from 'react'

import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  // prompt 데이터 가져오기
  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();

    setAllPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 대소문자 구분없이 검색 - 'i'
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    // 연속된 입력에 대해 불필요한 검색 함수 호출을 방지하기 위해 입력할 때마다 설정된 대기 시간(setSearchTimeout)을 취소
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // 디바운스 기법 사용자가 입력할 때마다 네트워크에 요청을 보내는 것을 방지하기 위해 입력을 멈춘 후 0.5초가 지난 후에 검색이 되도록 설정
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  // 태그 클릭시 태그 검색 결과 보이게 하기
  const handleTagClick = (tagName) => {
    // 검색 창에 태그 표시
    setSearchText(tagName);

    // 검색 결과에 태그 검색된 결과 표시
    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>

      {/* All Prompts */}
      {searchText ? (
        // 검색 결과가 있으면 검색 결과 표시
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        // 검색 결과가 없으면 전체 프롬프트 목록 표시
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;