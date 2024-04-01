import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import users from '../datamapper/user.datamapper.js';

async function signup(req, res) {
  try {
    // Récupérer les données d'inscription depuis le corps de la requête
    const { email, password, confirmation } = req.body;

    // On vérifie que tous les champs sont remplis
    if (!email || !password || !confirmation) {
      res.status(400).json({ errorMessage: 'Veuillez remplir tous les champs' });
      return;
    }

    // On vérifie que les mots de passe correspondent
    if (password !== confirmation) {
      res.status(400).json({ errorMessage: 'Les mots de passe ne correspondent pas' });
      return;
    }

    // On vérifie que l'email n'est pas déjà utilisé
    const alreadyExistingUser = await users.findByEmail(email);
    if (alreadyExistingUser) {
      res.status(400).json({ errorMessage: 'Cet email est déjà utilisé' });
      return;
    }

    // On hash le mot de passe avant de le stocker en BDD
    const numberSaltRounds = parseInt(process.env.NB_OF_SALT_ROUNDS, 10);
    const hashedPassword = await bcrypt.hash(password, numberSaltRounds);

    // On crée le user en BDD
    await users.create({ email, password: hashedPassword });

    // Envoi d'un message de succès
    res.status(201).json({ successMessage: 'Votre compte a bien été créé, veuillez à présent vous authentifier' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'inscription." });
  }
}

async function login(req, res) {
  try {
    // Logique pour connecter un utilisateur
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
}

export { login, signup };
