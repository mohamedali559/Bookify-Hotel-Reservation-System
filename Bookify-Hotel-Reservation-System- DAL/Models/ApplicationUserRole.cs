using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookify_Hotel_Reservation_System__DAL.Models
{
    public  class ApplicationUserRole
    {
        public string UserId{ get; set; }
        public string RoleId{ get; set; }

        public ApplicationUser User { get; set; }
        public ApplicationRole Role{ get; set; }
    }
}
