using System;
using System.Collections.Generic;

namespace webapi.Models;

public partial class Revisione
{
    public int RevisionId { get; set; }

    public int VehicleId { get; set; }

    public DateTime FechaHora { get; set; }

    public string Items { get; set; } = null!;
}
