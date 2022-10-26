import java.util.Scanner;

public class AEveryoneLovesToSleep {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        for (int k = 1; k <= t; k++) {
            int n = sc.nextInt();
            int h = sc.nextInt();;
            int m = sc.nextInt();;

//            for(int i=1; i<=n; i++){
//                int a = sc.nextInt();
//                int b = sc.nextInt();
//
//                if(h==a && m==b) {
//                    System.out.println(0 + " " + 0);
//                    break;
//                }
//
//                else if(a>=h){
//                    if(b==0)
//                        b = 60;
//
//                    System.out.println((a-h)+" "+(b-m));
//                }
//
//                else if(h>a){
//                    if(b==0)
//                        b=60;
//
//
//                }
//            }

            int[] arr1 = new int[2*n];
            int[] arr2 = new int[2*n];

            for(int i=0; i<n; i++) {
                arr1[i] = sc.nextInt();
                arr2[i] = sc.nextInt();
            }

            int a = sc.nextInt();
            int b = sc.nextInt();

            for(int i=0; i<n; i++){
                if(h==arr1[i] && m==arr2[i]){
                    a=0;
                    b=0;
                    break;
                }




                
            }

        }
    }
}
