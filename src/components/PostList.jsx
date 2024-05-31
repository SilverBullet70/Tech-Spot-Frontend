import React, { useRef, useState, useCallback } from 'react';
import Post from './Post';
import useFeedLoading from './useFeedLoading'
import SharedPost from './SharedPost';


function PostList({ feedType, feedValue, offset, limit }) {


    const [feedTypeState, setFeedTypeState] = useState(feedType);
    const [offsetState, setOffsetState] = useState(offset);
    const [limitState, setLimitState] = useState(limit);


    const {
        mixedPosts,
        loading,
        error,
        hasMore
    } = useFeedLoading(feedTypeState, feedValue, offsetState, limitState);

    const observer = useRef();
    const lastPostElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {

            if (entries[0].isIntersecting && hasMore) {
                setOffsetState(prevOffset => prevOffset + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);


    //const [clientUsername, setClientUsername] = useState('hello');

    //, setPosts);


    return (
        <>
            {mixedPosts.map((post, index) => {
                if (post.contentType === "Post") {
                    if (mixedPosts.length === index + 1) {

                        // return <div style={{
                        //     color: 'red',
                        //     fontSize: '20px',
                        //     margin: 50
                        // }} ref={lastPostElementRef} key={index}>{post.textData}</div>

                        return <Post
                            key={post.contentID || index}
                            ref={lastPostElementRef}
                            contentID={post.contentID}
                            timestamp={post.timestamp}
                            textData={post.textData}
                            mediaData={post.mediaData}
                            authorName={post.contentAuthor.name}
                            authorProfilePic={post.contentAuthor.profilePic || '/default-profile.jpg'}
                            authorProfession={post.contentAuthor.profession || 'No Profession'}
                            numOfReactions={post.numOfReactions}
                            numOfComments={post.numOfComments}
                            numOfShares={post.numOfShares}
                            reactionsUrl={post._links.reactions.href}
                            commentsUrl={post._links.comments.href}
                            selfUrl={post._links.self.href}
                            authorUrl={post._links.author.href}
                        />

                    } else {
                        return <Post
                            key={post.contentID || index}
                            contentID={post.contentID}
                            timestamp={post.timestamp}
                            textData={post.textData}
                            mediaData={post.mediaData}
                            authorName={post.contentAuthor.name}
                            authorProfilePic={post.contentAuthor.profilePic || '/default-profile.jpg'}
                            authorProfession={post.contentAuthor.profession || 'No Profession'}
                            numOfReactions={post.numOfReactions}
                            numOfComments={post.numOfComments}
                            numOfShares={post.numOfShares}
                            reactionsUrl={post._links.reactions.href}
                            commentsUrl={post._links.comments.href}
                            selfUrl={post._links.self.href}
                            authorUrl={post._links.author.href}
                        />

                        // return <div style={{
                        //     color: 'red',
                        //     fontSize: '20px',
                        //     margin: 50
                        // }} ref={lastPostElementRef} key={index}>{post.textData}</div>
                    }
                } else {
                    return <SharedPost key={post.contentID} sharedPost={post} />
                }
            }
            )}
        </>
    );
}

export default PostList;
