using System;
using System.Collections;
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

public class VehiclesdatumsController : ControllerBase
{
    private readonly VehiclesContext _context;

    public VehiclesdatumsController(VehiclesContext context)
    {
        _context = context;
    }

    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Vehiclesdatum>>> getVehicles() 
    {
        return await _context.Vehiclesdata.ToListAsync();
    }

  
    [HttpGet("{placa}")]
    public IActionResult getVehicle(string placa)
    {
        var carro = from m in _context.Vehiclesdata select m; //almacena toda la tabla de la bd

        try{
            if (!String.IsNullOrEmpty(placa))
            {
                carro = carro.Where(s => s.Placa == placa); 
            }
            return Ok(carro); //me retorna el resultado de carro
        } catch {
            return null;
        }

    }

    // POST
    [HttpPost]
    public async Task<IActionResult> PostVehicle([FromForm] Vehiclesdatum vehicle)// desde un formulario me llega info de tipo vehicledatum
    {
        if (vehicle == null)
        {
            return Ok(401);
        }
        var carro = from m in _context.Vehiclesdata select m;
        bool idCarro = false;

        foreach (var item in carro)
        {
            if(item.Placa == vehicle.Placa)
            {
                idCarro = true;
                break;
            }
        }
        if(!idCarro)
        {
            _context.Vehiclesdata.Add(vehicle);// si el vehiculo no es nulo se agrega a Vehiclesdata
            await _context.SaveChangesAsync();// se espera a que la base de datos responda (await)
            return Ok(vehicle);
        }
        else
        {
            return Ok(500);
        }
    }
}
