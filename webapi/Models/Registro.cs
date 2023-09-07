using System;
using System.Collections.Generic;

namespace webapi.Models;

public partial class Registro
{
    public int RegistroId { get; set; }

    public int RevisionId { get; set; }

    public string Nombre { get; set; } = null!;

    public string Apellido { get; set; } = null!;

    public string Comentarios { get; set; } = null!;
}
