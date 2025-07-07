import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Chip,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { zhCN } from "date-fns/locale";
import { useNavigate, useParams } from "react-router-dom";
import { thingsApi, tagsApi } from "../services/api";
import { CreateThingDto, Tag } from "../types";

const ThingForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newTag, setNewTag] = useState<string>("");

  const [formData, setFormData] = useState<CreateThingDto>({
    name: "",
    expireAt: new Date().toISOString(),
    notifyBeforeExpiry: 0,
    isRecurring: false,
    recurringInterval: 1,
    quantity: 1,
    tags: [],
  });

  useEffect(() => {
    loadTags();
    if (id) {
      loadThing();
    }
  }, [id]);

  const loadTags = async () => {
    try {
      const tagsData = await tagsApi.getAll();
      setTags(tagsData);
    } catch (err) {
      console.error("加载标签失败:", err);
    }
  };

  const loadThing = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const thing = await thingsApi.getById(id);
      setFormData({
        name: thing.name,
        expireAt: thing.expireAt,
        notifyBeforeExpiry: thing.notifyBeforeExpiry,
        isRecurring: thing.isRecurring,
        recurringInterval: thing.recurringInterval,
        quantity: thing.quantity,
        tags: thing.tags.map((tag) => tag.name),
      });
    } catch (err) {
      setError("加载事物失败");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (id) {
        await thingsApi.update(id, {
          ...formData,
          recurringInterval: Number(formData.recurringInterval),
          notifyBeforeExpiry: Number(formData.notifyBeforeExpiry),
          quantity: Number(formData.quantity),
        });
      } else {
        await thingsApi.create({
          ...formData,
          recurringInterval: Number(formData.recurringInterval),
          notifyBeforeExpiry: Number(formData.notifyBeforeExpiry),
          quantity: Number(formData.quantity),
        });
      }

      navigate("/");
    } catch (err) {
      setError("保存失败");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof CreateThingDto, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setDeleting(true);
      await thingsApi.delete(id);
      navigate("/");
    } catch (err) {
      setError("删除失败");
      console.error(err);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleAddNewTag = () => {
    if (newTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag],
      }));
      setNewTag("");
    }
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
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: 600, mx: "auto" }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          {id ? "编辑事物" : "添加新事物"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="事物名称"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DateTimePicker
              label="过期时间"
              value={new Date(formData.expireAt)}
              onChange={(date) =>
                handleInputChange("expireAt", date?.toISOString() || "")
              }
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="提前提醒时间（天）"
              value={formData.notifyBeforeExpiry ?? ""}
              onChange={(e) => {
                // 允许用户自由输入，保持原始字符串
                handleInputChange("notifyBeforeExpiry", e.target.value);
              }}
              onBlur={(e) => {
                // 失去焦点时进行验证和转换
                const value = parseInt(e.target.value);
                if (isNaN(value) || value < 0) {
                  handleInputChange("notifyBeforeExpiry", 0);
                } else {
                  handleInputChange("notifyBeforeExpiry", String(value));
                }
              }}
              helperText="例如：1 = 1天，7 = 1周"
              inputProps={{ min: 0, step: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={tags.map((tag) => tag.name)}
              value={formData.tags || []}
              inputValue={newTag}
              onChange={(_, newValue) => handleInputChange("tags", newValue)}
              onInputChange={(_, newInputValue) => setNewTag(newInputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="标签"
                  placeholder="选择或输入标签"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} {...getTagProps({ index })} />
                ))
              }
              freeSolo
            />
            <Button
              variant="contained"
              onClick={handleAddNewTag}
              sx={{ mt: 1 }}
            >
              添加新项
            </Button>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isRecurring}
                  onChange={(e) => {
                    const isRecurring = e.target.checked;
                    handleInputChange("isRecurring", isRecurring);
                    // 如果开启循环，自动设置数量为1
                    if (isRecurring) {
                      handleInputChange("quantity", 1);
                    }
                  }}
                />
              }
              label="循环提醒"
            />
          </Grid>

          {formData.isRecurring && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="循环间隔（天）"
                value={formData.recurringInterval ?? ""}
                onChange={(e) => {
                  // 允许用户自由输入，保持原始字符串
                  handleInputChange("recurringInterval", e.target.value);
                }}
                onBlur={(e) => {
                  // 失去焦点时进行验证和转换
                  const value = parseInt(e.target.value);
                  if (isNaN(value) || value < 1) {
                    handleInputChange("recurringInterval", 1);
                  } else {
                    handleInputChange("recurringInterval", String(value));
                  }
                }}
                helperText="例如：1 = 1天，7 = 1周"
                inputProps={{ min: 1, step: 1 }}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="数量"
              value={formData.quantity}
              onChange={(e) => {
                // 允许用户自由输入，保持原始字符串
                handleInputChange("quantity", e.target.value);
              }}
              onBlur={(e) => {
                // 失去焦点时进行验证和转换
                const value = parseInt(e.target.value);
                if (isNaN(value) || value < 1) {
                  handleInputChange("quantity", 1);
                } else {
                  handleInputChange("quantity", String(value));
                }
              }}
              inputProps={{ min: 1 }}
              disabled={formData.isRecurring}
              helperText={formData.isRecurring ? "循环事物数量固定为1" : ""}
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  sx={{ minWidth: 120 }}
                >
                  {saving ? (
                    <CircularProgress size={20} />
                  ) : id ? (
                    "更新"
                  ) : (
                    "创建"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/")}
                  disabled={saving}
                >
                  取消
                </Button>
              </Box>
              {id && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={saving}
                >
                  删除
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>确定要删除这个事物吗？此操作不可撤销。</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            取消
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} /> : "删除"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ThingForm;
