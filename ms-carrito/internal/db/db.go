package db

import (
	"carrito/internal/env"
	"carrito/internal/model"
	"carrito/internal/utils"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func DatabaseConnection() *gorm.DB {

	port := env.GetInt("DATABASE_PORT", 5435)

	var (
		host     = env.GetString("DATABASE_HOST", "localhost")
		user     = env.GetString("DATABASE_USERNAME", "user")
		password = env.GetString("DATABASE_PASSWORD", "password")
		dbName   = env.GetString("DATABASE_NAME", "carrito_db")
	)

	sqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbName)

	db, err := gorm.Open(postgres.Open(sqlInfo), &gorm.Config{})
	utils.ErrorPanic(err)

	err = db.AutoMigrate(&model.Carrito{})
	utils.ErrorPanic(err)
	err = db.AutoMigrate(&model.CursoCarrito{})
	utils.ErrorPanic(err)
	return db
}
