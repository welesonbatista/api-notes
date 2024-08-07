const sqliteConnection = require("../database/sqlite");
const DiskStorage = require("../providers/diskStorage");

class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id;
    const avatarFilename = request.file.filename;

    const database = await sqliteConnection();
    const diskStorage = new DiskStorage();

    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if (!user) {
      throw new AppError("Somente usuários autenticados podem mudar o avatar", 401);
    }

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    const filename = await diskStorage.saveFile(avatarFilename);
    user.avatar = filename;

    await database.run(
      `UPDATE users SET 
      avatar = ?,
      updated_at = ?
      WHERE id = ?`,
      [user.avatar, new Date(), user_id]
    );

    return response.json(user);
  }
}

module.exports = UserAvatarController;