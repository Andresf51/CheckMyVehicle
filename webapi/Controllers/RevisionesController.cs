using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]

public class RevisionesController : ControllerBase
{
    private readonly VehiclesContext _context;

    public RevisionesController(VehiclesContext context)
    {
        _context = context;
    }

    // GET: Vehiclesdatums
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Revisione>>> getRevisiones()
    {
        return await _context.Revisiones.ToListAsync();
    }

    [HttpGet("{placa}")]
    public IActionResult getRevisiones(string placa)
    {
        var carro = from m in _context.Vehiclesdata select m; //almacena toda la tabla de la bd

        try
        {
            int id = 0;
            // obtenemos el id de la placa que ingrewsa el usuario
            if (!String.IsNullOrEmpty(placa))
            {
                carro = carro.Where(s => s.Placa == placa);
            }
            foreach (var item in carro)
            {
                id = item.VehicleId;
                break;
            }
            var revision = from m in _context.Revisiones select m;
            // obtener revision que correspoinden al id anterior
            if (id != 0)
            {
                revision = revision.Where(s => s.VehicleId == id);
            }
            return Ok(revision); //me retorna el resultado de carro
        }
        catch
        {
            return null;
        }
    }

    // POST
    // Cuando entra el metodo post.
    // 1- se encarga de encontrar el id que corresponde a la placa del vehiculo que el usuario ingresa
    // 2- se encarga de verificar el ultimo id de revision de ese vehiculo
    // 3- compara ese id de revision con la columna idrevision de la tabla registros
    // 4- se encuentra el id en la tabla registros es por que la revision  ya se hizo, y se puede agendar una nueva revision, si no la encuentra es por que hay una revision pendiente
    [HttpPost]
    public async Task<IActionResult> PostRevision([FromForm] NuevaRevision vehicle)// desde un formulario me llega info de tipo revisione
    {
        var revision = from m in _context.Vehiclesdata select m; //almacena todos los datos de la tabla vehiclesdata

        try
        {
            if (!String.IsNullOrEmpty(vehicle.Placa))
            {
                int id = 0;
                revision = revision.Where(s => s.Placa == vehicle.Placa);//la var revision almacena el vehicle que contiene la placa que el usuria ingreso
                
                foreach (var item in revision)
                {
                    id = item.VehicleId;
                    break;
                }

                var revisionVerificar = from m in _context.Revisiones select m;
                revisionVerificar = revisionVerificar.Where(s => s.VehicleId == id);

                int idRevision = 0;
                foreach (var item in revisionVerificar)
                {
                    idRevision = item.RevisionId;
                }
                var registroVerificar = from m in _context.Registros select m;
                registroVerificar = registroVerificar.Where(s => s.RevisionId == idRevision);
                int idRegistro = 0;
                foreach (var item in registroVerificar)
                {
                    idRegistro = item.RevisionId;
                }
                if(idRevision == idRegistro)
                {
                    Revisione nuevaRevision = new Revisione();
                    nuevaRevision.VehicleId = id;
                    nuevaRevision.FechaHora = vehicle.FechaHora;
                    nuevaRevision.Items = vehicle.Items;
                    _context.Revisiones.Add(nuevaRevision);
                    await _context.SaveChangesAsync();
                    return Ok(nuevaRevision);
                }
                else
                {
                    return Ok("El vehiculo tiene revisiones pendientes");
                }

            }
            return BadRequest("Los datos de la revision son inválidos.");
        }
        catch
        {
            return null;
        }
    }
}
