using System;
using System.Collections.Generic;

namespace webapi.Models;

public partial class Vehiclesdatum
{
    public int VehicleId { get; set; }

    public string Placa { get; set; } = null!;

    public string Marca { get; set; } = null!;

    public string Linea { get; set; } = null!;

    public int Modelo { get; set; }
}
