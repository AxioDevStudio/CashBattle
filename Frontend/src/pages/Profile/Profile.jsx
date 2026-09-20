import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Camera,
    Trash2,
    Pencil,
    Lock,
    LogOut,
    User,
    Mail,
    Target,
    Wallet,
    Trophy,
    Flame,
    Star
} from "lucide-react";

import api from "../../services/api";
import "../../styles/pages/profile.css";

function Profile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);

    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        monthlyIncome: "",
        otherIncome: "",
        monthlyGoal: "",
        goalCategory: "",
        competitionMode: "solo"
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        loadProfile();
    }, []);

    function getToken() {
        return localStorage.getItem("cashbattle_token");
    }

    function showMessage(text) {
        setMessage(text);
        setError("");

        setTimeout(() => {
            setMessage("");
        }, 3000);
    }

    function showError(text) {
        setError(text);
        setMessage("");

        setTimeout(() => {
            setError("");
        }, 3000);
    }

    async function loadProfile() {
        try {
            const response = await api.get("/profile", {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            const data = response.data.profile;

            setProfile(data);

            setForm({
                name: data.name || "",
                email: data.email || "",
                monthlyIncome: data.monthly_income || "",
                otherIncome: data.other_income || "",
                monthlyGoal: data.monthly_goal || "",
                goalCategory: data.goal_category || "",
                competitionMode: data.competition_mode || "solo"
            });

            localStorage.setItem("cashbattle_user", JSON.stringify(data));
        } catch {
            showError("Não foi possível carregar o perfil.");
        } finally {
            setLoading(false);
        }
    }

    function getAvatarUrl() {
        if (preview) return preview;

        if (!profile?.avatar_url) return null;

        if (profile.avatar_url.startsWith("http")) {
            return profile.avatar_url;
        }

        const apiUrl =
            import.meta.env.VITE_API_FILE_URL ||
            "";

        return `${apiUrl}${profile.avatar_url}`;
    }

    async function handleAvatarUpload(event) {
        const file = event.target.files[0];

        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            showError("A imagem deve ter no máximo 2 MB.");
            return;
        }

        setPreview(URL.createObjectURL(file));

        const data = new FormData();
        data.append("avatar", file);

        try {
            setUploading(true);

            await api.post("/profile/avatar", data, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            showMessage("Foto atualizada com sucesso.");
            await loadProfile();
        } catch (err) {
            showError(err.response?.data?.error || "Erro ao enviar foto.");
        } finally {
            setUploading(false);
        }
    }

    async function removeAvatar() {
        if (!window.confirm("Deseja remover sua foto de perfil?")) return;

        try {
            await api.delete("/profile/avatar", {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            setPreview(null);
            showMessage("Foto removida.");
            await loadProfile();
        } catch {
            showError("Erro ao remover foto.");
        }
    }

    async function updateProfile(event) {
        event.preventDefault();

        try {
            await api.put("/profile", form, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            showMessage("Perfil atualizado.");
            setEditOpen(false);
            await loadProfile();
        } catch (err) {
            showError(err.response?.data?.error || "Erro ao atualizar perfil.");
        }
    }

    async function changePassword(event) {
        event.preventDefault();

        try {
            await api.put("/profile/password", passwordForm, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            showMessage("Senha alterada com sucesso.");
            setPasswordOpen(false);

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (err) {
            showError(err.response?.data?.error || "Erro ao alterar senha.");
        }
    }

    function logout() {
        localStorage.removeItem("cashbattle_token");
        localStorage.removeItem("cashbattle_user");
        navigate("/login");
    }

    function money(value) {
        return Number(value || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    if (loading) {
        return (
            <main className="profile-page">
                <section className="profile-loading">
                    Carregando perfil...
                </section>
            </main>
        );
    }

    return (
        <main className="profile-page">
            <header className="profile-topbar">
                <button onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={22} />
                </button>

                <div>
                    <span>Minha conta</span>
                    <h1>Perfil</h1>
                </div>

                <button className="danger-button" onClick={logout}>
                    <LogOut size={21} />
                </button>
            </header>

            {message && <span className="success">{message}</span>}
            {error && <span className="error">{error}</span>}

            <section className="profile-header">
                <label className="avatar-upload">
                    {getAvatarUrl() ? (
                        <img src={getAvatarUrl()} alt="Foto de perfil" />
                    ) : (
                        <span>{profile?.name?.charAt(0)?.toUpperCase()}</span>
                    )}

                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleAvatarUpload}
                    />

                    <div className="camera-badge">
                        <Camera size={17} />
                    </div>
                </label>

                <h1>{profile?.name}</h1>
                <p>{profile?.email}</p>

                <button
                    className="remove-avatar"
                    onClick={removeAvatar}
                    disabled={uploading}
                >
                    <Trash2 size={16} />
                    {uploading ? "Enviando..." : "Remover foto"}
                </button>
            </section>

            <section className="profile-stats">
                <article>
                    <Star size={20} />
                    <span>XP</span>
                    <strong>{profile?.xp || 0}</strong>
                </article>

                <article>
                    <Trophy size={20} />
                    <span>Nível</span>
                    <strong>{profile?.level || 1}</strong>
                </article>

                <article>
                    <Flame size={20} />
                    <span>Streak</span>
                    <strong>{profile?.streak || 0}</strong>
                </article>
            </section>

            <section className="profile-summary">
                <article>
                    <Wallet size={22} />
                    <div>
                        <p>Renda mensal</p>
                        <strong>{money(profile?.monthly_income)}</strong>
                    </div>
                </article>

                <article>
                    <Target size={22} />
                    <div>
                        <p>Meta mensal</p>
                        <strong>{money(profile?.monthly_goal)}</strong>
                    </div>
                </article>
            </section>

            <section className="profile-info-card">
                <div className="section-title">
                    <h2>Informações</h2>

                    <button onClick={() => setEditOpen(true)}>
                        <Pencil size={16} />
                        Editar
                    </button>
                </div>

                <div className="profile-row">
                    <User size={18} />
                    <div>
                        <span>Nome</span>
                        <strong>{profile?.name}</strong>
                    </div>
                </div>

                <div className="profile-row">
                    <Mail size={18} />
                    <div>
                        <span>Email</span>
                        <strong>{profile?.email}</strong>
                    </div>
                </div>

                <div className="profile-row">
                    <Target size={18} />
                    <div>
                        <span>Objetivo</span>
                        <strong>{profile?.goal_category || "Não definido"}</strong>
                    </div>
                </div>
            </section>

            <section className="profile-info-card">
                <div className="section-title">
                    <h2>Segurança</h2>

                    <button onClick={() => setPasswordOpen(true)}>
                        <Lock size={16} />
                        Alterar senha
                    </button>
                </div>

                <p className="profile-muted">
                    Mantenha sua conta segura atualizando sua senha quando necessário.
                </p>
            </section>

            {editOpen && (
                <div className="modal-overlay">
                    <form className="profile-modal" onSubmit={updateProfile}>
                        <h2>Editar perfil</h2>

                        <input
                            placeholder="Nome"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />

                        <input
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Renda mensal"
                            value={form.monthlyIncome}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    monthlyIncome: e.target.value
                                })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Outras rendas"
                            value={form.otherIncome}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    otherIncome: e.target.value
                                })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Meta mensal"
                            value={form.monthlyGoal}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    monthlyGoal: e.target.value
                                })
                            }
                        />

                        <input
                            placeholder="Categoria da meta"
                            value={form.goalCategory}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    goalCategory: e.target.value
                                })
                            }
                        />

                        <select
                            value={form.competitionMode}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    competitionMode: e.target.value
                                })
                            }
                        >
                            <option value="solo">Individual</option>
                            <option value="friends">Com amigos</option>
                            <option value="groups">Grupo privado</option>
                            <option value="public">Ranking público</option>
                        </select>

                        <div className="modal-actions">
                            <button type="button" onClick={() => setEditOpen(false)}>
                                Cancelar
                            </button>

                            <button type="submit">
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {passwordOpen && (
                <div className="modal-overlay">
                    <form className="profile-modal" onSubmit={changePassword}>
                        <h2>Alterar senha</h2>

                        <input
                            type="password"
                            placeholder="Senha atual"
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                                setPasswordForm({
                                    ...passwordForm,
                                    currentPassword: e.target.value
                                })
                            }
                        />

                        <input
                            type="password"
                            placeholder="Nova senha"
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                                setPasswordForm({
                                    ...passwordForm,
                                    newPassword: e.target.value
                                })
                            }
                        />

                        <input
                            type="password"
                            placeholder="Confirmar nova senha"
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                                setPasswordForm({
                                    ...passwordForm,
                                    confirmPassword: e.target.value
                                })
                            }
                        />

                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={() => setPasswordOpen(false)}
                            >
                                Cancelar
                            </button>

                            <button type="submit">
                                Alterar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}

export default Profile;