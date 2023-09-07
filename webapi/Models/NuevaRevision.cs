namespace webapi.Models
{
    public class NuevaRevision
    {
        public string Placa { get; set; }

        public DateTime FechaHora { get; set; }

        public string Items { get; set; } = null!;
    }
}
