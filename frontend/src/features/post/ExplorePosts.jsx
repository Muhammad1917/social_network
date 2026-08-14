import { useNavigate } from "react-router-dom";
import PostList from "../../components/post/PostList";
import { Box, Typography } from "@mui/material";
import SearchBar from "../../components/search/SearchBar";



export default function ExplorePage() {

    const navigate = useNavigate()
    return (

        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                py: 2,
                maxWidth: 700,
                mx: "auto",
            }}
        >
            <SearchBar
                width="100%"
                onUserSelect={(user) => {
                    navigate(
                        `/profile/${user.username}`
                    );
                }}
                onPostSelect={(post) => {
                    navigate(`/posts/${post.id}`);
                }}
                onSearchSubmit={(query) => {
                    navigate(
                        `/search?q=${encodeURIComponent(query)}`
                    );
                }}
            />

            <Typography
                variant="h5"
                fontWeight={600}
                sx={{
                    maxWidth: 700,
                    mx: "auto",
                    px:{
                        xs:1,
                        sm:2,
                    },
                    mb:2,
                }}
            >
                Explore
            </Typography>


            <PostList />

        </Box>

    );
}