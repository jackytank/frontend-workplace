/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package hibernateexample;

import java.util.Iterator;
import java.util.List;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

/**
 *
 * @author Producer
 */
public class QueryExample {

    private static SessionFactory factory;
    private static ServiceRegistry registry;
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        try{
           // factory = new Configuration().configure().buildSessionFactory();
            Configuration configuration = new Configuration().configure();
            registry = new StandardServiceRegistryBuilder().applySettings(
                    configuration.getProperties()).build();
            factory = configuration.buildSessionFactory(registry);
        }catch (Throwable ex) { 
         System.err.println("Failed to create sessionFactory object." + ex);
         throw new ExceptionInInitializerError(ex); 
      }
        
        //HQL Examples
        Session session = factory.openSession();
        //Transaction tx = null;
      
      try{
         //tx = session.beginTransaction();
		 Query query = session.createQuery("from Employee as e where e.firstName "
		 	 	 + "like 'S%' and salary > 10000");
		 List employees = query.list();
         for (Iterator iterator = 
                         employees.iterator(); iterator.hasNext();){
       /*     Employee ee = (Employee) iterator.next(); 
            System.out.print("First Name: " + ee.getFirstName()); 
            System.out.print("  Last Name: " + ee.getLastName()); 
            System.out.println("  Salary: " + ee.getSalary()); 
        */    }
         
         
      }catch (HibernateException e) {
        // if (tx!=null) tx.rollback();
         e.printStackTrace(); 
      }finally {
         session.close(); 
      }
        
    
        StandardServiceRegistryBuilder.destroy(registry);
    
    }
    
}
