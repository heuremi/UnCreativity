package utils

import "log"

func ErrorPanic(err error) {
	if err != nil {
		log.Print(err)
		panic(err)
	}
}
