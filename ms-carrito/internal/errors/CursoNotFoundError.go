package customerrors

type CursoNotFoundError struct {
	Msg string
}

func (e *CursoNotFoundError) Error() string {
	return e.Msg
}
