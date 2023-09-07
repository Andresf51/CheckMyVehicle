using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class RegistroesController : ControllerBase
{
    private readonly VehiclesContext _context;

    public RegistroesController(VehiclesContext context)
    {
        _context = context;
    }

    // GET: Registroes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Registro>>> getRegistro()
    {
        return await _context.Registros.ToListAsync();
    }

    [HttpGet("{placa}")]
    public IActionResult getRegistros(string placa)
    {
        var carro = from m in _context.Vehiclesdata select m; //almacena toda la tabla de la bd

        try
        {
            int id = 0, revisionId = 0;
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
             foreach (var item in revision)
            {
                revisionId = item.RevisionId;
            }

            var registro = from m in _context.Registros select m;
            // obtener revision que correspoinden al id anterior
            if (id != 0)
            {
                registro = registro.Where(s => s.RevisionId == revisionId);
            }

            return Ok(registro); //me retorna el resultado de carro
        }
        catch
        {
            return null;
        }
    }

    [HttpPost]
    public async Task<IActionResult> PostRevision([FromForm] NuevoRegistro vehicle)// desde un formulario me llega info de tipo revisione
    {
        var registro = from m in _context.Vehiclesdata select m; //almacena todos los datos de la tabla vehiclesdata
            
        try
        {
            if (!String.IsNullOrEmpty(vehicle.Placa))
            {
                int id = 0;
                registro = registro.Where(s => s.Placa == vehicle.Placa);//la variable revision almacena el vehicle que contiene la placa que el usuria ingreso

                foreach (var item in registro)
                {
                    id = item.VehicleId;
                    break;
                }

                var revision = from m in _context.Revisiones select m;
                revision = revision.Where(s => s.VehicleId == id);

                int idRevision = 0;
                foreach (var item in revision)
                {
                    idRevision = item.RevisionId;
                }

                Registro nuevaRegistro = new Registro();
                nuevaRegistro.RevisionId = idRevision;
                nuevaRegistro.Nombre = vehicle.Nombre;
                nuevaRegistro.Apellido = vehicle.Apellido; 
                nuevaRegistro.Comentarios = vehicle.Comentarios;
                _context.Registros.Add(nuevaRegistro);
                await _context.SaveChangesAsync();
                return Ok(nuevaRegistro);
            }
            return BadRequest("Los datos del registro son inválidos.");
        }
        catch
        {
            return null;
        }
    }
}

