import React from "react";
import "./styles/SkeletonLoading.css";
import { Box, Grid, Skeleton } from "@mui/material";

const SkeletonLoading = () => {
  return (
    <Box className="div-skeleton-loading-parent">
      <Grid container spacing={2}>
        {[
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        ].map((arr) => (
          <Grid key={arr} item lg sm xs md>
            <Box className="div-skeleton-container">
              <Skeleton
                variant="rectangular"
                className="skeleton-loading-img-box"
              />
              <Skeleton className="skeleton-text-name" />
              <Box className="div-skeleton-genre-platform">
                <Skeleton className="skeleton-genre-platform" />
                <Skeleton className="skeleton-genre-platform" />
                <Skeleton className="skeleton-genre-platform" />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SkeletonLoading;
