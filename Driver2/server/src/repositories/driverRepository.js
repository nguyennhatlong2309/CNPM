const db = require('../db');

class DriverRepository {
  async getDriverProfile(driverId) {
    try {
      const [driver] = await db.query(
        `SELECT t.*, x.biensoxe, x.loaixe, x.namsanxuat, x.sochongoi, x.trangthai as trangthaixe
         FROM taixe t
         LEFT JOIN xebuyt x ON t.MATX = x.MATX
         WHERE t.MATX = ?`,
        [driverId]
      );
      
      if (!driver) {
        throw new Error('Driver not found');
      }
      
      return driver;
    } catch (error) {
      console.error('Error in getDriverProfile:', error);
      throw error;
    }
  }

  async updateDriverProfile(driverId, profileData) {
    const {
      email,
      diachi,
      ngaysinh,
      loaigiayphep,
      ngayhethan,
      ngayvaolam,
      sokm,
      danhgia,
      trangthai,
      biensoxe,
      loaixe,
      namsanxuat,
      sochongoi,
      trangthaixe
    } = profileData;

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Update driver table
      await connection.query(
        `UPDATE taixe 
         SET email = ?, diachi = ?, ngaysinh = ?, giayphep = ?, 
             loaigiayphep = ?, ngayhethan = ?, ngayvaolam = ?, 
             sokm = ?, danhgia = ?, trangthai = ?
         WHERE MATX = ?`,
        [
          email,
          diachi,
          ngaysinh,
          profileData.giayphep,
          loaigiayphep,
          ngayhethan,
          ngayvaolam,
          sokm,
          danhgia,
          trangthai,
          driverId
        ]
      );

      // Update xebuyt table if vehicle data is provided
      if (biensoxe || loaixe || namsanxuat || sochongoi || trangthaixe) {
        await connection.query(
          `UPDATE xebuyt 
           SET biensoxe = COALESCE(?, biensoxe),
               loaixe = COALESCE(?, loaixe),
               namsanxuat = COALESCE(?, namsanxuat),
               sochongoi = COALESCE(?, sochongoi),
               trangthai = COALESCE(?, trangthai)
           WHERE MATX = ?`,
          [biensoxe, loaixe, namsanxuat, sochongoi, trangthaixe, driverId]
        );
      }

      await connection.commit();
      
      // Return updated profile
      return this.getDriverProfile(driverId);
    } catch (error) {
      await connection.rollback();
      console.error('Error updating driver profile:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new DriverRepository();
