import User from '../models/User';

class AuthController {
  async signUp (req, res) {
    const { email, nome, senha, telefones } = req.body;

    if (!email) {
      return res.status(401).json({ message: 'E-mail inválido' });
    }

    if (!nome) {
      return res.status(401).json({ message: 'Nome inválido' });
    }

    if (!senha) {
      return res.status(401).json({ message: 'Senha inválida' });
    }

    const newUser = new User({ nome, senha, email, telefones });

    try {
      await newUser.save();
    } catch (err) {
      return res.status(400).json({ message: 'E-mail já existente' });
    }

    const token = await newUser.generateToken();

    return res.json({
      id: newUser.id,
      nome: newUser.nome,
      email: newUser.email,
      data_criacao: newUser.createdAt,
      data_atualizacao: newUser.updatedAt,
      ultimo_login: newUser.lastLogin,
      telefones: newUser.telefones,
      token: token
    });
  }

  async signIn (req, res) {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Usuário e/ou senha inválidos" });
    }

    if (!await user.checkPassword(senha)) {
      return res.status(401).json({ message: "Usuário e/ou senha inválidos" });
    }

    const token = await user.generateToken();

    await user.updateLastLoginTime();

    return res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      data_criacao: user.createdAt,
      data_atualizacao: user.updatedAt,
      ultimo_login: user.lastLogin,
      telefones: user.telefones,
      token: token
    });
  }
}

export default new AuthController();