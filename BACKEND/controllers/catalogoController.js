const catalogosService = require('../services/catalogoService');

exports.getActividades = async(req,res)=>{
    try{
        const actividades = await catalogosService.getActividades();
        res.json(actividades);
    }catch(error){
        console.error('Error al obtener actividades:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

exports.getDepartamentos = async(req,res)=>{
    try{
        const departamentos = await catalogosService.getDepartamentos();
        res.json(departamentos);
    }catch(error){
        console.error('Error al obtener departamentos:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

exports.getParentescos = async(req,res)=>{
    try{
        const parentescos = await catalogosService.getParentescos();
        res.json(parentescos);
    }catch(error){
        console.error('Error al obtener parentescos:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

exports.getPuestos = async(req,res) =>{
    try{
        const NombreDepartamento = req.params;
        
        const puestos = await catalogosService.getPuestos(NombreDepartamento);

        if(!puestos){
            return res.status(404).json({error: 'Departamento no encontrado'});
        }

        res.json(puestos);
    }catch(error){
        console.error('Error al obtener puestos:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}


exports.getDocumentos = async (req, res) => {
    try {
        const documentos = await catalogosService.getDocumentos();
        res.json(documentos);
    } catch (error) {
        console.error('Error al obtener documentos:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
