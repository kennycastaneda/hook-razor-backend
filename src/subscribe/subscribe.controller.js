const SubscribeService = require("./subscribe.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasData(req, res, next) {
   const methodName = "hasData";
   req.log.debug({ __filename, methodName, body: req.body });

   if (req.body.data) {
      req.log.trace({ __filename, methodName, valid: true });
      return next();
   }
   const message = "body must have data property";
   next({ status: 400, message: message });
   req.log.trace({ __filename, methodName, valid: false }, message);
}

function dataHas(propertyName) {
   const methodName = `dataHas('${propertyName}')`;
   return (req, res, next) => {
      req.log.debug({ __filename, methodName, body: req.body });
      const { data = {} } = req.body;
      const value = data[propertyName];
      if (value) {
         req.log.trace({ __filename, methodName, valid: true });
         return next();
      }
      const message = `Subscribe must include a ${propertyName}`;
      next({ status: 400, message: message });
      req.log.trace({ __filename, methodName, valid: false }, message);
   };
}

const hasEmail = dataHas("email");

function validEmailLength(req, res, next) {
   const methodName = "validEmailLength";
   req.log.debug({ __filename, methodName, body: req.body });

   if (req.body.data.email.length < 140) {
      req.log.trace({ __filename, methodName, valid: true });
      return next();
   }
   const message = "email is too long";
   next({ status: 400, message: message });
   req.log.trace({ __filename, methodName, valid: false }, message);
}

async function create(req, res) {
   const newSubscribe = await SubscribeService.create(req.body.data);

   res.status(201).json({
      data: newSubscribe[0],
   });
}

module.exports = {
   create: [hasData, hasEmail, validEmailLength, asyncErrorBoundary(create)],
};
