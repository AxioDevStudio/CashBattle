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
    Wallet
} from "lucide-react";

import api from "../../services/api";
import "../../styles/pages/profile.css";

function Profile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [editOpen, setEditOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);

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

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        try {
            const token = localStorage.getItem("cashbattle_token");

            const response = await api.get("/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
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
        } catch (err) {
            setError("Não foi possível carregar o perfil.");
        } finally {
            setLoading(false);
        }
    }

    function getAvatarUrl() {
        if (!profile?.avatar_url) return null;

        if (profile.avatar_url.startsWith("http")) {
            return profile.avatar_url;
        }

        return `${import.meta.env.VITE_API_FILE_URL || ""}${profile.avatar_url}`;
    }

    async function handleAvatarUpload(event) {
        const file = event.target.files[0];

        if (!file) return;

        const data = new FormData();
        data.append("avatar", file);

        try {
            const token = localStorage.getItem("cashbattle_token");

            await api.post("/profile/avatar", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            setMessage("Foto atualizada com sucesso.");
            loadProfile();
        } catch (err) {
            setError(err.response?.data?.error || "Erro ao enviar foto.");
        }
    }

    async function removeAvatar() {
        try {
            const token = localStorage.getItem("cashbattle_token");

            await api.delete("/profile/avatar", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage("Foto removida.");
            loadProfile();
        } catch (err) {
            setError("Erro ao remover foto.");
        }
    }

    async function updateProfile(event) {
        event.preventDefault();

        try {
            const token = localStorage.getItem("cashbattle_token");

            await api.put("/profile", form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage("Perfil atualizado.");
            setEditOpen(false);
            loadProfile();
        } catch (err) {
            setError(err.response?.data?.error || "Erro ao atualizar perfil.");
        }
    }

    async function changePassword(event) {
        event.preventDefault();

        try {
            const token = localStorage.getItem("cashbattle_token");

            await api.put("/profile/password", passwordForm, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage("Senha alterada com sucesso.");
            setPasswordOpen(false);

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (err) {
            setError(err.response?.data?.error || "Erro ao alterar senha.");
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
        return <main className="profile-page">Carregando...</main>;
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
                        accept="image/*"
                        onChange={handleAvatarUpload}
                    />

                    <div className="camera-badge">
                        <Camera size={17} />
                    </div>
                </label>

                <h1>{profile?.name}</h1>
                <p>{profile?.email}</p>

                <button className="remove-avatar" onClick={removeAvatar}>
                    <Trash2 size={16} />
                    Remover foto
                </button>
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
                                setForm({ ...form, monthlyIncome: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Outras rendas"
                            value={form.otherIncome}
                            onChange={(e) =>
                                setForm({ ...form, otherIncome: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Meta mensal"
                            value={form.monthlyGoal}
                            onChange={(e) =>
                                setForm({ ...form, monthlyGoal: e.target.value })
                            }
                        />

                        <input
                            placeholder="Categoria da meta"
                            value={form.goalCategory}
                            onChange={(e) =>
                                setForm({ ...form, goalCategory: e.target.value })
                            }
                        />

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