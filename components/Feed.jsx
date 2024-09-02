"use client";

import { useState, useEffect } from "react";

import PromptCard from "@components/PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
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
  const [posts, setPosts] = useState([]);
  // Search
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const updatePosts = (searchtext) => {
    const regex = new RegExp(searchtext, "i");
    const newPosts = posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.promptme) ||
        regex.test(item.tag)
    );

    return newPosts;
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = updatePosts(e.target.value);
        setFilteredPosts(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    const searchResults = updatePosts(tagName);
    setFilteredPosts(searchResults);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/prompt");
        if (!response.ok) {
          throw new Error("Failed to fetch prompts");
        }
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      <PromptCardList data={filteredPosts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
