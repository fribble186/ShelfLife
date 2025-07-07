import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Grid,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit as EditIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { format, isBefore, addDays } from "date-fns";
import { zhCN } from "date-fns/locale";
import { thingsApi, tagsApi, consumptionApi } from "../services/api";
import { Thing, Tag } from "../types";

const ThingList = () => {
  const [things, setThings] = useState<Thing[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [selectedTag]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [thingsData, tagsData] = await Promise.all([
        thingsApi.getAll(selectedTag || undefined),
        tagsApi.getAll(),
      ]);
      setThings(thingsData);
      setTags(tagsData);
    } catch (err) {
      setError("加载数据失败");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConsume = async (thing: Thing) => {
    try {
      await consumptionApi.consume(thing.id, 1);
      await loadData(); // 重新加载数据
    } catch (err) {
      setError("消耗失败");
      console.error(err);
    }
  };

  const getExpiryStatus = (
    expireAt: string,
    notifyBeforeExpiry: number = 1
  ) => {
    const expireDate = new Date(expireAt);
    const now = new Date();
    const tomorrow = addDays(now, notifyBeforeExpiry);

    if (isBefore(expireDate, now)) {
      return { status: "expired", color: "error", text: "已过期" };
    } else if (isBefore(expireDate, tomorrow)) {
      return { status: "expiring", color: "warning", text: "即将过期" };
    } else {
      return { status: "normal", color: "success", text: "正常" };
    }
  };

  const handleTagChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedTag(newValue);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1">
          我的事物
        </Typography>
      </Box>

      {/* 标签筛选标签页 */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={selectedTag}
          onChange={handleTagChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="全部" value="" />
          {tags.map((tag) => (
            <Tab key={tag.id} label={tag.name} value={tag.name} />
          ))}
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={1}>
        {things.map((thing) => {
          const expiryStatus = getExpiryStatus(
            thing.expireAt,
            thing.notifyBeforeExpiry
          );
          return (
            <Grid item xs={12} sm={6} md={4} key={thing.id}>
              <Card
                sx={{
                  height: "100%",
                  border:
                    expiryStatus.status === "expired"
                      ? "2px solid #f44336"
                      : expiryStatus.status === "expiring"
                      ? "2px solid #ff9800"
                      : "none",
                }}
              >
                <CardContent
                  sx={{
                    paddingTop: 0.5,
                    paddingBottom: 0.5,
                    "&:last-child": {
                      paddingBottom: 0.5,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="h6" component="h2" noWrap>
                      {thing.name}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/edit/${thing.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleConsume(thing)}
                        color="primary"
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    过期时间:{" "}
                    {format(new Date(thing.expireAt), "yyyy-MM-dd HH:mm", {
                      locale: zhCN,
                    })}
                  </Typography>

                  <Box
                    sx={{ display: "flex", gap: 1, mb: 0.5, flexWrap: "wrap" }}
                  >
                    <Chip
                      label={expiryStatus.text}
                      color={expiryStatus.color as any}
                      size="small"
                    />
                    {thing.isRecurring && (
                      <Chip label="循环" color="primary" size="small" />
                    )}
                    <Chip
                      label={`数量: ${thing.quantity}`}
                      color="secondary"
                      size="small"
                    />
                  </Box>

                  {(thing?.tags || []).length === 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        mb: 0.5,
                        flexWrap: "wrap",
                      }}
                    >
                      {thing.tags.map((tag: Tag) => (
                        <Chip
                          key={tag.id}
                          label={tag.name}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {things.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            暂无事物，点击右上角添加第一个事物吧！
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ThingList;
