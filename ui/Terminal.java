package ui;
import java.util.Scanner;
import classes.*;

public class Terminal {

    public static void iniciar(){ // primeira tela a ser vista
 
        Scanner scan = new Scanner(System.in);

        System.out.println("========== CLÍNICA DE ESTÉTICA ROSA BELA ==========");
        System.out.println("[1] LOGIN\n[2] CADASTRAR-SE\n[3] SAIR");
        System.out.println("Escolha uma opção: ");

        String entrada = scan.nextLine();

        
        switch (entrada) {
            case "1":
                usuario();
                break;
            default:
                break;
        }

        scan.close();
    }

    public static void usuario(){ // verifica se é cliente ou funcionário da clinica

        Scanner scan = new Scanner(System.in);
        
        System.out.println("[1] SOU CLIENTE\n[2] SOU FUNCIONÁRIO");
        System.out.println("Escolha uma opção: ");

        String entrada =  scan.next();

        switch (entrada) {
            case "1":
                classes.Cliente.realizarlogin();
                break;
                
            case "2":
                System.out.println("teste 2");
                break;
        
            default:
                usuario();
        }

        scan.close();
    }
        
    
}
